var React = require("react");

class userCreationForm extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <form method="POST" action="/userCreation">
            <div className="user-details">
              username:<input name="username" type="text" />
            </div>
            <div className="user-details">
              email:<input name="email" type="text" />
            </div>
            <div className="user-details">
              password:<input name="password" type="password" />
            </div>
            <div className="user-details">
              confirm password:<input name="height" type="password" />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = userCreationForm;
