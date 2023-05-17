/** @jsxImportSource solid-js */

export const StoryTypeBadge = (props) => (
  <span
    class={`flex-none br-100 ba ${
      props.type === "feature"
        ? "bg-yellow b--gold"
        : props.type === "bug"
        ? "bg-light-red b--dark-red"
        : "bg-moon-gray b--gray"
    }`}
    style={`width: 8px; height: 8px; ${
      props.highlight ? "transform: scale(1.5);" : ""
    }`}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  />
);
