const ConferenceLinks = ({ currentUser }) => {
  // Define conference links inside the component
  const conferenceLinks = [
    { href: "/authored-conferences", label: "Authored Conferences" },
    { href: "/my-conferences", label: "My Conferences" },
    { href: "/add", label: "Add Conference" },
  ];

  return (
    <div>
      {currentUser &&
        conferenceLinks.map((link, index) => (
          <a key={index} href={link.href}>
            <button style={{ padding: "5px", marginLeft: "5px" }}>
              {link.label}
            </button>
          </a>
        ))}
    </div>
  );
};

export default ConferenceLinks;
