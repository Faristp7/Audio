export function getHome(req ,res){
    res.render("user/index")
}
export function getshop(req ,res){
    res.render("user/shop")
}
export function shopSingle(req ,res){
    res.render("user/shopSingle")
}
export function login(req ,res){
    res.render("user/login")
}
export function signup(req ,res){
    res.render("user/signup")
}