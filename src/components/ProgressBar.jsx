/** @jsxImportSource solid-js */

export const ProgressBar = (props) => {
  return (
    <div
      class="w-100 br3 bg-white flex ba b--moon-gray overflow-hidden"
      style="height: 6px;"
    >
      <div
        class="bg-green br3"
        style={`height: 4px; width: ${
          (props.numDone / props.numStories) * 100
        }%;`}
      />
      <div
        class="bg-light-green br3"
        style={`height: 4px; width: ${
          (props.numInProgress / props.numStories) * 100
        }%;`}
      />
    </div>
  );
};
