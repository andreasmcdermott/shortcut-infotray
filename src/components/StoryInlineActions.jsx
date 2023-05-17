/** @jsxImportSource solid-js */

export const StoryInlineActions = (props) => {
  return (
    <div class="hover-action absolute h-100 bg-white ph2" style="right: 0;">
      <a href={props.story.app_url} target="_blank" rel="noopener noreferrer">
        Open
      </a>
    </div>
  );
};
