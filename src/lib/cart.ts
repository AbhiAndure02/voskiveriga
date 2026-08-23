export const recalcCart = (cart: any) => {
    cart.totalQuantity = cart.items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
    );

    cart.totalPrice = cart.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price,
        0
    );
};
