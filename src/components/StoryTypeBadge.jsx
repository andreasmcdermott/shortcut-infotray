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
    style={`width: 10px; height: 10px; ${
      props.highlight ? "transform: scale(1.5);" : ""
    }`}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  />
);
