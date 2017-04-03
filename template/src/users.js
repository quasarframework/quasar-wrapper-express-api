// Fake records
const users = [
    { name: 'tj' }
  , { name: 'ciaran' }
  , { name: 'aaron' }
  , { name: 'guillermo' }
  , { name: 'simon' }
  , { name: 'tobi' }
]

// Fake controller
class User {
  static  index(req, res) {
    res.send(users)
  }
  static  show(req, res) {
    res.send(users[req.params.id] || { error: 'Cannot find user' })
  }
  static  destroy(req, res, id) {
    var destroyed = id in users;
    delete users[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find user')
  }
  static  range (req, res, a, b, format) {
    const range = users.slice(a, b + 1)
    switch (format) {
      case 'json':
        res.send(range)
        break
      case 'html':
      default:
        var html = '<ul>' + range.map(user => {
          return '<li>' + user.name + '</li>'
        }).join('\n') + '</ul>'
        res.send(html)
        break
    }
  }
}

// Ad-hoc example resource method
module.exports.addUserResources = function(app, path) {
  app.get(path, User.index)
  app.get(path + '/:a..:b.:format?', (req, res) => {
    var a = parseInt(req.params.a, 10)
    var b = parseInt(req.params.b, 10)
    var format = req.params.format
    User.range(req, res, a, b, format)
  })
  app.get(path + '/:id', User.show)
  app.delete(path + '/:id', (req, res) => {
    var id = parseInt(req.params.id, 10)
    User.destroy(req, res, id)
  })
}

