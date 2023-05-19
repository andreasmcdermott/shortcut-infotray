/** @jsxImportSource solid-js */

export const InlineActions = (props) => {
  return (
    <div
      class={`hover-action absolute h-100 ph2 ${
        props.bg ? `bg-${props.bg}` : ""
      }`}
      style="right: 0;"
    >
      {props.children}
    </div>
  );
};
