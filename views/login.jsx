var React = require("react");

class login extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <form method="GET" action="/loginCheck">
            <div className="user-details">
              username:<input name="username" type="text" />
            </div>
            <div className="user-details">
              password:<input name="password" type="password" />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = login;
