import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getConferences = async (req, res) => {
  try {
    const conferences = await prisma.conference.findMany({});

    res.status(200).json(conferences);
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Failed to get conferences" });
  }
};

export const getConference = async (req, res) => {
  const id = req.params.id;

  try {
    const conference = await prisma.conference.findUnique({
      where: { id },
    });

    if (!conference) {
      return res.status(404).json({ message: "Conference not found" });
    }

    let userId;
    const token = req.cookies.token;

    if (!token) {
      userId = null;
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
          userId = null;
        } else {
          userId = payload.id;
        }
      });
    }
    res.status(200).json({ conference, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get conference" });
  }
};

export const addConference = async (req, res) => {
  const { conferenceData } = req.body; // Destructure conferenceData from body
  const tokenUserId = req.userId; // Assuming req.userId contains the user ID

  // Validate required fields
  if (
    !conferenceData.title ||
    !conferenceData.startDate ||
    !conferenceData.endDate
  ) {
    return res
      .status(400)
      .json({ message: "Title, start date, and end date are required." });
  }

  try {
    await prisma.conference.create({
      data: {
        title: conferenceData.title,
        description: conferenceData.description || "Default description",
        venue: conferenceData.venue || "Default venue",
        program: conferenceData.program || "Default program",
        startDate: new Date(conferenceData.startDate),
        endDate: new Date(conferenceData.endDate),
        authorId: tokenUserId,
        price: conferenceData.price !== undefined ? conferenceData.price : 0,
        guestSpeakers: conferenceData.guestSpeakers || [],
        topics: conferenceData.topics || [],
        upiId: conferenceData.upiId,
        bankName: conferenceData.bankName,
        accountName: conferenceData.accountName,
        ifscCode: conferenceData.ifscCode,
        branch: conferenceData.branch,
        externalUrl: conferenceData.externalUrl,
      },
    });

    res.status(201).json({
      message: "Conference successfully created",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create conference", error: err.message });
  }
};

//todo
export const updateConference = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deleteConference = async (req, res) => {
  const id = req.params.id; // The conference ID from the request parameters
  const tokenUserId = req.userId; // The user ID from the authenticated token (JWT)

  try {
    const conference = await prisma.conference.findUnique({
      where: { id },
    });

    if (!conference) {
      return res.status(404).json({ message: "Conference not found" });
    }

    // Check if the user requesting the delete is the author of the conference
    if (conference.authorId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "Not Authorized to delete this conference" });
    }
    await prisma.conference.delete({
      where: { id },
    });

    res.status(200).json({ message: "Conference deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete conference" });
  }
};
