export function AuthScreen(props) {
  return (
    <div class="flex flex-column justify-center items-center g2">
      <img
        src="/full_logo.png"
        alt=""
        class="w-50 absolute"
        style="top: 75px"
      />
      <p>You'll need to authenticate using your personal API key</p>
      <form
        className="flex flex-column g2 w-75 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSave(new FormData(e.target).get("apiKey").trim());
        }}
      >
        <input
          class="br2 pa2 ba w-100"
          type="text"
          name="apiKey"
          placeholder="API Key"
          required
        />
        <button
          className="b bg-light-blue navy w-50 pa2 ba b--navy br2"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
}
