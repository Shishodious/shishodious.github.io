import { scrollToSection } from "./sectionScroll";

/** In-page link to a section; a real #anchor so it still works without JS. */
const SectionLink = ({ to, children, ...props }) => (
  <a
    href={`#${to}`}
    onClick={(e) => {
      e.preventDefault();
      scrollToSection(to);
    }}
    {...props}
  >
    {children}
  </a>
);

export default SectionLink;
