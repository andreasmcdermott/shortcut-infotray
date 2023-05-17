/** @jsxImportSource solid-js */

const isExternal = (href) => /^https?:\/\//.test(href);

export const Link = (props) => {
  return (
    <a
      class="no-underline b blue"
      href={props.href}
      rel={isExternal(props.href) ? "noopener noreferer" : undefined}
      target={isExternal(props.href) ? "_blank" : undefined}
      style={props.style}
    >
      {props.children}
    </a>
  );
};
