###
# package a namespace
###
window.package ||= (packageName) ->
  nameArray = packageName.split "."
  packageToDeclare = ""
  obj = window
  for name in nameArray
    obj =  obj[name] ||= {}
