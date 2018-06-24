
//xu ly khong dung toi database
exports.add = (cart, item) => {
    if(cart.length === 0){
        cart.push(item);
    }else{
        for (i = cart.length - 1; i >= 0; i--) {
            if (cart[i].ProId === item.ProId) {
                cart[i].Quantity += item.Quantity;
                return;
            }
        }
        cart.push(item);
    }
}

exports.remove = (cart, proId) => {
    for (var i = cart.length - 1; i >= 0; i--) {
        if (proId === cart[i].ProId) {
            cart.splice(i, 1);
            return;
        }
    }
}