const { addCartItem, getCartItems, updateCartItem, removeCartItem, clearCart } = require('../services/cartService');
const sequelize = require('../models/index');
const Cart = require('../models/cart');

beforeAll(async () => {
  // Sync the database before running tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection after tests
  await sequelize.close();
});

beforeEach(async () => {
  // Clear the cart before each test to ensure a clean state
  await Cart.destroy({ where: {} });
});

describe('Cart Service Tests', () => {

  // Adding Items to the Cart:

  // Purpose: To ensure items can be added to the cart and are stored correctly.
  // Steps:
  //      1. Call addCartItem with sample data.
  //      2. Assert that the returned item's details match the input data.
  test('should add an item to the cart', async () => {
    const cartItemData = { userId: 1, productId: 1, quantity: 2 };
    const cartItem = await addCartItem(cartItemData);

    // Assertions
    expect(cartItem.userId).toBe(cartItemData.userId);
    expect(cartItem.productId).toBe(cartItemData.productId);
    expect(cartItem.quantity).toBe(cartItemData.quantity);
  });

  // Removing Items from the Cart:

  // Purpose: To ensure items can be removed from the cart.
  // Steps:
  //      1. Add an item to the cart.
  //      2. Call removeCartItem with the item's ID.
  //      3. Assert that the item is successfully removed and no longer exists in the database.
  test('should remove an item from the cart', async () => {
    const cartItemData = { userId: 1, productId: 2, quantity: 1 };
    const cartItem = await addCartItem(cartItemData);

    const result = await removeCartItem(cartItem.id);

    // Assertions
    expect(result).toBe(true);

    const deletedCartItem = await Cart.findByPk(cartItem.id);
    expect(deletedCartItem).toBeNull();
  });

  // Viewing Cart Items:

  // Purpose: To verify that all items in a user's cart can be retrieved.
  // Steps:
  //      1. Add multiple items to the cart for a specific user.
  //      2. Call getCartItems with the user's ID.
  //      3. Assert that the correct number of items is returned and that the details match the added items.
  test('should return all items in the user\'s cart', async () => {
    const userId = 1;

    // Add items to the cart
    await addCartItem({ userId, productId: 3, quantity: 1 });
    await addCartItem({ userId, productId: 4, quantity: 5 });

    const cartItems = await getCartItems(userId);

    // Assertions
    expect(cartItems.length).toBe(2);
    expect(cartItems[0].userId).toBe(userId);
    expect(cartItems[1].userId).toBe(userId);
  });

  // Updating Cart Items:

  // Purpose: To ensure that an item's quantity in the cart can be updated.
  // Steps:
  //      1. Add an item to the cart.
  //      2. Call updateCartItem with the item's ID and new quantity.
  //      3. Assert that the item's quantity is updated correctly.
  test('should update the quantity of an item in the cart', async () => {
    const cartItemData = { userId: 1, productId: 5, quantity: 2 };
    const cartItem = await addCartItem(cartItemData);

    const updatedQuantity = 5;
    const updatedCartItem = await updateCartItem(cartItem.id, updatedQuantity);

    // Assertions
    expect(updatedCartItem.quantity).toBe(updatedQuantity);
  });

  // Clearing the Cart:

  // Purpose: To ensure that all items in a user's cart can be cleared.
  // Steps:
  //      1. Add multiple items to the cart for a specific user.
  //      2. Call clearCart with the user's ID.
  //      3. Assert that the cart is empty after clearing.
  test('should clear all items in the user\'s cart', async () => {
    const userId = 2;

    // Add items to the cart
    await addCartItem({ userId, productId: 6, quantity: 1 });
    await addCartItem({ userId, productId: 7, quantity: 3 });

    // Clear the cart
    await clearCart(userId);

    const cartItems = await getCartItems(userId);

    // Assertions
    expect(cartItems.length).toBe(0);
  });

  // Handling Errors Gracefully:

  // Purpose: To ensure that the service handles errors gracefully, such as trying to update or remove a non-existent item.
  // Steps:
  //      1. Call updateCartItem with an invalid ID.
  //      2. Assert that the result is null.
  //      3. Call removeCartItem with an invalid ID.
  //      4. Assert that the result is false.
  test('should handle updating a non-existent item gracefully', async () => {
    const invalidId = 999;
    const updatedQuantity = 3;

    const result = await updateCartItem(invalidId, updatedQuantity);

    // Assertions
    expect(result).toBeNull();
  });

  test('should handle removing a non-existent item gracefully', async () => {
    const invalidId = 999;

    const result = await removeCartItem(invalidId);

    // Assertions
    expect(result).toBe(false);
  });
});
