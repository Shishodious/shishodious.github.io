import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import { useLiquidGlass } from "./effects/liquid-glass/useLiquidGlass";
import "./effects/liquid-glass/liquid-glass.css";

const links = [
  {
    id: 1,
    label: "LinkedIn",
    icon: <FaLinkedin size={16} />,
    href: "https://www.linkedin.com/in/priyanshu-shishodia",
  },
  {
    id: 2,
    label: "GitHub",
    icon: <FaGithub size={16} />,
    href: "https://github.com/Shishodious",
  },
  {
    id: 3,
    label: "Email",
    icon: <HiOutlineMail size={16} />,
    href: "mailto:priyanshushishodia008@gmail.com",
  },
  {
    id: 4,
    label: "Resume",
    icon: <HiOutlineDocumentArrowDown size={16} />,
    href: "/Resume.pdf",
    download: "Priyanshu-Shishodia-Resume.pdf",
  },
];

const SocialLinks = () => {
  // Narrow vertical pill → gentle refraction, radius matches the CSS below.
  const glassRef = useLiquidGlass({ radius: 20, scale: -80, chroma: 5, blur: 2, border: 0.12 });

  return (
    <aside className="fixed hidden lg:flex flex-col items-center gap-4 bottom-8 left-4 z-40">
      <ul
        ref={glassRef}
        className="lg-surface flex flex-col gap-4 rounded-[26px] px-3 py-5"
      >
        {links.map(({ id, label, icon, href, download }) => (
          <li key={id}>
            <a
              href={href}
              download={download}
              target={download || href.startsWith("mailto") ? "_self" : "_blank"}
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="block text-muted hover:text-accent hover:-translate-y-1 transition-all duration-300"
            >
              {icon}
            </a>
          </li>
        ))}
      </ul>
      {/* Rail */}
      <div className="w-px h-20 bg-ink/15" />
    </aside>
  );
};

export default SocialLinks;
