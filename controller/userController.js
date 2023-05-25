export function getHome(req ,res){
    try {
        res.render("user/index")
    } catch (error) {
        console.log(error);
    }
}
export function getshop(req ,res){
    try {
        res.render("user/shop")
    } catch (error) {
        console.log(error);
    }
    
}
export function shopSingle(req ,res){
    try {
        res.render("user/shopSingle")
    } catch (error) {
        console.log(error);
    }
}
export function login(req ,res){
    try {
        res.render("user/login")  
    } catch (error) {
        console.log(error);
    }
}
export function signup(req ,res){
    try {
        res.render("user/signup")
    } catch (error) {
        console.log(error);
    }
}