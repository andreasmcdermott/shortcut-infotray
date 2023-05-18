/** @jsxImportSource solid-js */

export const ProgressBar = (props) => {
  return (
    <div
      class="w-100 br3 bg-white flex ba b--moon-gray overflow-hidden relative"
      style="height: 6px;"
    >
      <div
        class="bg-light-green br3 absolute"
        style={`height: 4px; top: 0; left: 0; width: ${
          ((props.numDone + props.numInProgress) / props.numStories) * 100
        }%;`}
      />
      <div
        class="bg-green br3 absolute"
        style={`height: 4px; left: 0; top: 0; width: ${
          (props.numDone / props.numStories) * 100
        }%;`}
      />
    </div>
  );
};
