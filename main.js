function onTouchMove(a) {
  $(a.currentTarget).innerHeight() < a.currentTarget.scrollHeight ? a.stopPropagation() : a.preventDefault()
}
angular.element(document).ready(function() {
  function a() {
    b()
  }

  function b() {
    var a = document.createElement("link");
    a.setAttribute("rel", "stylesheet"), a.setAttribute("type", "text/css"), a.setAttribute("href", g), document.getElementsByTagName("head")[0].appendChild(a), c(0)
  }

  function c(a) {
    var b = f[a],
      c = document.getElementsByTagName("script")[0],
      e = document.createElement("script");
    e.onload = d, e.src = b, c.parentNode.insertBefore(e, c)
  }

  function d() {
    e += 1, e === f.length ? angular.element(document).ready(function() {
      angular.bootstrap(document, ["defaultLibrary"])
    }) : c(e)
  }
  var e = 0,
    f = ["js/app.js", "js/config.js", "js/controllers/mainController.js", "js/controllers/resortController.js", "js/controllers/regionController.js", "js/controllers/alertController.js", "js/controllers/userGuideController.js", "js/controllers/membershipController.js", "js/directives/map.js", "js/directives/share-link.js", "js/services/resortService.js"],
    g = "styles/styles.css",
    h = location.href.lastIndexOf("/index.html");
  0 > h && (h = location.href.lastIndexOf("/")), window.baseUrl = "", a()
});
