import { motion } from 'framer-motion';

const FLOAT_ITEMS = [
  { type: 'coin', left: '8%', size: 30, delay: 0, duration: 6.5 },
  { type: 'cash', left: '22%', size: 40, delay: 1.1, duration: 8.2 },
  { type: 'symbol', left: '38%', size: 22, delay: 0.7, duration: 7.1 },
  { type: 'bag', left: '48%', size: 34, delay: 1.9, duration: 8.8 },
  { type: 'coin', left: '58%', size: 26, delay: 1.8, duration: 6.8 },
  { type: 'cash', left: '76%', size: 36, delay: 0.4, duration: 8.6 },
  { type: 'flying', left: '84%', size: 42, delay: 0.9, duration: 9.2 },
  { type: 'symbol', left: '90%', size: 20, delay: 1.5, duration: 7.5 },
];

const STICKERS = [
  { type: 'bag', side: 'left', top: '8%', size: 56, delay: 0.2, duration: 4.8 },
  { type: 'flying', side: 'right', top: '14%', size: 64, delay: 0.6, duration: 5.4 },
];

const IMAGE_BY_TYPE = {
  coin: '/money-coin.svg',
  cash: '/cash-stack.svg',
  bag: '/money-bag-cartoon.svg',
  flying: '/flying-cash-cartoon.svg',
};

function MoneyFloaters({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {STICKERS.map((sticker, index) => (
        <motion.img
          key={`sticker-${sticker.type}-${index}`}
          src={IMAGE_BY_TYPE[sticker.type]}
          alt=""
          style={{
            top: sticker.top,
            width: sticker.size,
            height: 'auto',
            left: sticker.side === 'left' ? '4%' : 'auto',
            right: sticker.side === 'right' ? '3%' : 'auto',
          }}
          className="absolute opacity-70"
          initial={{ y: 8, rotate: sticker.side === 'left' ? -8 : 8 }}
          animate={{
            y: [0, -7, 0],
            rotate: sticker.side === 'left' ? [-8, -3, -8] : [8, 2, 8],
          }}
          transition={{
            duration: sticker.duration,
            delay: sticker.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {FLOAT_ITEMS.map((item, index) => {
        const commonMotion = {
          initial: { y: 140, rotate: -8 },
          animate: {
            y: [-20, -210],
            rotate: [-10, 11],
            x: [0, index % 2 === 0 ? 13 : -13],
          },
          transition: {
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          },
        };

        if (item.type === 'symbol') {
          return (
            <motion.div
              key={`symbol-${index}`}
              style={{ left: item.left, fontSize: item.size }}
              className="absolute bottom-[-24px] font-semibold text-emerald-300/60"
              {...commonMotion}
            >
              $
            </motion.div>
          );
        }

        const icon = IMAGE_BY_TYPE[item.type];
        if (icon) {
          const width = item.type === 'cash' ? item.size + 24 : item.type === 'flying' ? item.size + 18 : item.size;
          return (
            <motion.img
              key={`asset-${item.type}-${index}`}
              src={icon}
              alt=""
              style={{ left: item.left, width, height: item.size }}
              className="absolute bottom-[-24px] opacity-30"
              {...commonMotion}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

export default MoneyFloaters;
