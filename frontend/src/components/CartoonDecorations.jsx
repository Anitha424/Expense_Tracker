import { motion } from 'framer-motion';

const BUBBLES = [
  { left: '2%', top: '12%', size: 86, color: 'bg-emerald-300/20', duration: 7.2, delay: 0 },
  { left: '14%', top: '68%', size: 64, color: 'bg-green-300/20', duration: 6.6, delay: 0.5 },
  { left: '82%', top: '18%', size: 78, color: 'bg-lime-300/20', duration: 8.1, delay: 0.2 },
  { left: '88%', top: '72%', size: 58, color: 'bg-emerald-200/20', duration: 5.8, delay: 0.7 },
];

const STICKERS = [
  { src: '/money-bag-cartoon.svg', left: '3%', top: '36%', width: 66, duration: 5.4, delay: 0.4, rotate: -12 },
  { src: '/flying-cash-cartoon.svg', left: '79%', top: '44%', width: 108, duration: 6.1, delay: 0.8, rotate: 9 },
  { src: '/money-coin.svg', left: '47%', top: '8%', width: 34, duration: 4.8, delay: 0.1, rotate: -8 },
];

function CartoonDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {BUBBLES.map((bubble, idx) => (
        <motion.div
          key={`bubble-${idx}`}
          className={`absolute rounded-full blur-sm ${bubble.color}`}
          style={{ left: bubble.left, top: bubble.top, width: bubble.size, height: bubble.size }}
          initial={{ scale: 0.8 }}
          animate={{
            y: [0, -12, 0],
            x: [0, idx % 2 === 0 ? 8 : -8, 0],
            scale: [0.9, 1.06, 0.92],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {STICKERS.map((sticker, idx) => (
        <motion.img
          key={`sticker-${idx}`}
          src={sticker.src}
          alt=""
          className="absolute opacity-75"
          style={{ left: sticker.left, top: sticker.top, width: sticker.width, transform: `rotate(${sticker.rotate}deg)` }}
          animate={{
            y: [0, -8, 0],
            x: [0, idx % 2 === 0 ? 5 : -5, 0],
          }}
          transition={{
            duration: sticker.duration,
            delay: sticker.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default CartoonDecorations;
