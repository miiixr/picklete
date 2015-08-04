(() ->
  # app = angular.module("mainApp", [])
  # app.controller "mainCtrl", ($scope) ->

  #   # default subscribed is set false
  #   $scope.subscribed = false
    
  #   $scope.submitSubscribe = () ->
  #     email = $scope.subscribeEmail
  #     if $scope.form.email.$error.email
  #       return alert("Email 格式錯誤，請再次確認你的 Email ")

  #     if $scope.form.email.$error.required
  #       return alert("Email 資料不可為空，請正確填入你的 Email")

  #     $scope.subscribed = true
  #     alert("感謝關注 Zuru, 請到信件中確認你的關注資訊以獲得最新 Zuru 消息。")
  #     $scope.subscribeEmail = ""
  #     $scope.$apply()

  #     # alert("thanks")
  #     io.socket.post "/user/subscribe", email: email
  #     , (data) ->
  #       return

  loader = (scripts) ->
    scripts.forEach (src) ->
      script = document.createElement('script')
      script.src = src
      script.async = false
      document.head.appendChild(script)
      return

  routePath = (config) ->
    path = location.pathname
    for key of config
      if path.indexOf(key) > -1
        loader(config[key].js) 
    
  config = {
    "/": 
      js: [
        "/js/controller/wishItem_main.js"
      ]
    "/wishItem/show/": 
      js: [
        "/js/controller/wishItem_main.js"
      ]
  }

  routePath(config)

  console.log "run ok"
  return
)()