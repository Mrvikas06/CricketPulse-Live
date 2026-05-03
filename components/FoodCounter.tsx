import { useMemo, useState } from 'react';
import { Clock3, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  station: string;
  image: string;
  tag: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Masala Chai',
    price: 80,
    station: 'Pavilion Tea',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=500&q=80',
    tag: 'Hot pick',
  },
  {
    id: 2,
    name: 'Vada Pav',
    price: 120,
    station: 'Gate 3',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=500&q=80',
    tag: 'Fast lane',
  },
  {
    id: 3,
    name: 'Samosa Basket',
    price: 150,
    station: 'North Stand',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
    tag: 'Shareable',
  },
  {
    id: 4,
    name: 'Lemon Soda',
    price: 90,
    station: 'Family Enclosure',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=500&q=80',
    tag: 'Cold',
  },
];

export default function FoodCounter() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);

  const cartTotal = useMemo(
    () =>
      menuItems.reduce((total, item) => {
        return total + (cart[item.id] || 0) * item.price;
      }, 0),
    [cart],
  );

  const itemCount = useMemo(
    () => Object.values(cart).reduce((total, count) => total + count, 0),
    [cart],
  );

  const deliveryEta = itemCount ? Math.max(4, 10 - itemCount) : 0;

  const updateCart = (itemId: number, amount: number) => {
    setCart((current) => {
      const nextCount = Math.max(0, (current[itemId] || 0) + amount);
      const next = { ...current, [itemId]: nextCount };
      if (nextCount === 0) delete next[itemId];
      return next;
    });
  };

  return (
    <section className="utility-panel food-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Ground orders</p>
          <h3>Food Counter</h3>
        </div>
        <div className="cart-total">
          <span>Rs {cartTotal}</span>
          <small>{itemCount} items</small>
        </div>
      </div>

      <motion.div
        key={selectedItem.id}
        className="food-hero"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(12, 14, 24, .82), rgba(12, 14, 24, .18)), url(${selectedItem.image})` }}
        initial={{ opacity: 0.82 }}
        animate={{ opacity: 1 }}
      >
        <span>
          <Star className="h-3.5 w-3.5" />
          {selectedItem.tag}
        </span>
        <strong>{selectedItem.name}</strong>
        <small>{selectedItem.station} - Rs {selectedItem.price}</small>
      </motion.div>

      <div className="menu-list image-menu-list">
        {menuItems.map((item) => {
          const count = cart[item.id] || 0;

          return (
            <motion.div
              key={item.id}
              className={selectedItem.id === item.id ? 'menu-row image-menu-row selected-food' : 'menu-row image-menu-row'}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setSelectedItem(item)}
              onFocus={() => setSelectedItem(item)}
            >
              <button
                type="button"
                className="food-thumb"
                style={{ backgroundImage: `url(${item.image})` }}
                onClick={() => setSelectedItem(item)}
                aria-label={`Preview ${item.name}`}
                title={`Preview ${item.name}`}
              />
              <div className="menu-copy">
                <strong>{item.name}</strong>
                <span>{item.station}</span>
              </div>
              <div className="menu-price">Rs {item.price}</div>
              <div className="stepper" aria-label={`${item.name} quantity`}>
                <button
                  type="button"
                  onClick={() => updateCart(item.id, -1)}
                  aria-label={`Remove ${item.name}`}
                  title={`Remove ${item.name}`}
                  disabled={!count}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span>{count}</span>
                <button
                  type="button"
                  onClick={() => updateCart(item.id, 1)}
                  aria-label={`Add ${item.name}`}
                  title={`Add ${item.name}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="delivery-strip">
        <Clock3 className="h-4 w-4" />
        <span>{itemCount ? `Estimated seat delivery in ${deliveryEta} min` : 'Add items to estimate delivery'}</span>
      </div>

      <button type="button" className="primary-button" disabled={!itemCount}>
        <ShoppingCart className="h-4 w-4" />
        Seat Delivery
      </button>
    </section>
  );
}
