import prisma from "../lib/prisma.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { userId, conferenceId, registrationDetail } = req.body;

    // Check if registrationDetail is provided
    if (!registrationDetail) {
      return res
        .status(400)
        .json({ error: "Registration details are required." });
    }

    const existingRegistration = await prisma.registration.findFirst({
      where: { userId, conferenceId },
    });
    if (existingRegistration) {
      return res
        .status(400)
        .json({ error: "User is already registered for this conference." });
    }

    const identityCardUrl =
      req.files["identityCard"] && req.files["identityCard"][0]
        ? `uploads/${req.files["identityCard"][0].filename}`
        : null;
    const paymentProofUrl =
      req.files["paymentProof"] && req.files["paymentProof"][0]
        ? `uploads/${req.files["paymentProof"][0].filename}`
        : null;

    if (!identityCardUrl) {
      return res.status(400).json({ error: "IdentityCardUrl invalid" });
    }
    if (!paymentProofUrl) {
      return res.status(400).json({ error: "PaymentProofUrl invalid" });
    }

    const identityCardCloudinaryUpload = await uploadOnCloudinary(
      identityCardUrl
    );
    const paymentProofCloudinaryUpload = await uploadOnCloudinary(
      paymentProofUrl
    );
    if (!identityCardCloudinaryUpload) {
      return res
        .status(400)
        .json({ error: "IdentityCardCloudinaryUpload failed" });
    }
    if (!paymentProofCloudinaryUpload) {
      return res
        .status(400)
        .json({ error: "paymentCardCloudinaryUpload failed" });
    }

    const registration = await prisma.registration.create({
      data: {
        userId,
        conferenceId,
        approved: false, // Default approval status is false
        registrationDate: new Date(),
        registrationDetail: {
          create: {
            email: registrationDetail.email,
            fullName: registrationDetail.fullName,
            gender: registrationDetail.gender,
            participationMode: registrationDetail.participationMode,
            mobileNumber: registrationDetail.mobileNumber,
            identityCardUrl: identityCardCloudinaryUpload,
            transactionDate: registrationDetail.transactionDate
              ? new Date(registrationDetail.transactionDate)
              : new Date(),
            paymentProofUrl: paymentProofCloudinaryUpload,
          },
        },
      },
    });

    // console.log("Registration successful:", registration);
    res.status(201).json(registration);
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

// Get all registrations for a specific user
export const getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRegistrations = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        registrations: {
          include: { conference: true }, // Include conference details
        },
      },
    });

    if (!userRegistrations) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(userRegistrations.registrations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user registrations." });
  }
};

// Get all registrations for a specific conference
export const getConferenceRegistrations = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    // Fetch conference with related registrations and user data
    const conferenceRegistrations = await prisma.conference.findUnique({
      where: { id: conferenceId },
      include: {
        registrations: {
          include: { user: true, registrationDetail: true },
        },
      },
    });

    if (!conferenceRegistrations) {
      return res.status(404).json({ error: "Conference not found." });
    }

    res.status(200).json(conferenceRegistrations.registrations);
  } catch (error) {
    console.error("Error fetching conference registrations:", error);
    res.status(500).json({
      error: "An error occurred while fetching conference registrations.",
    });
  }
};

// Approve or reject a registration
export const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve } = req.body;

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: { approved: approve },
    });

    res.status(200).json(updatedRegistration);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating registration approval status.",
    });
  }
};

// Delete a registration
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.registration.delete({
      where: { id },
    });

    res.status(200).json({ message: "Registration deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the registration." });
  }
};
