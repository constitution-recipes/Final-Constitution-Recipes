'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// 기본 HTML 엘리먼트와 motion 컴포넌트 매핑
const motionComponents = {
  div: motion.div,
  span: motion.span,
  button: motion.button,
  a: motion.a,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  ul: motion.ul,
  li: motion.li,
  section: motion.section,
  header: motion.header,
  footer: motion.footer,
  main: motion.main,
  nav: motion.nav,
  form: motion.form,
  input: motion.input,
  label: motion.label,
  textarea: motion.textarea,
  select: motion.select,
  option: motion.option,
  img: motion.img,
  svg: motion.svg,
  path: motion.path,
};

// 모션 컴포넌트 생성 함수
function createMotionComponent(component) {
  return React.forwardRef(({ children, ...props }, ref) => {
    const MotionComponent = motionComponents[component];
    return (
      <MotionComponent ref={ref} {...props}>
        {children}
      </MotionComponent>
    );
  });
}

// 모션 컴포넌트 내보내기
export const MotionDiv = createMotionComponent('div');
export const MotionSpan = createMotionComponent('span');
export const MotionButton = createMotionComponent('button');
export const MotionA = createMotionComponent('a');
export const MotionH1 = createMotionComponent('h1');
export const MotionH2 = createMotionComponent('h2');
export const MotionH3 = createMotionComponent('h3');
export const MotionH4 = createMotionComponent('h4');
export const MotionH5 = createMotionComponent('h5');
export const MotionH6 = createMotionComponent('h6');
export const MotionP = createMotionComponent('p');
export const MotionUl = createMotionComponent('ul');
export const MotionLi = createMotionComponent('li');
export const MotionSection = createMotionComponent('section');
export const MotionHeader = createMotionComponent('header');
export const MotionFooter = createMotionComponent('footer');
export const MotionMain = createMotionComponent('main');
export const MotionNav = createMotionComponent('nav');
export const MotionForm = createMotionComponent('form');
export const MotionInput = createMotionComponent('input');
export const MotionLabel = createMotionComponent('label');
export const MotionTextarea = createMotionComponent('textarea');
export const MotionSelect = createMotionComponent('select');
export const MotionOption = createMotionComponent('option');
export const MotionImg = createMotionComponent('img');
export const MotionSvg = createMotionComponent('svg');
export const MotionPath = createMotionComponent('path');

// 애니메이션 변형 프리셋
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

export const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

// 카드/항목 호버 효과
export const cardHover = {
  rest: { scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  hover: { scale: 1.03, transition: { duration: 0.2, ease: 'easeIn' } }
};

// framer-motion 기본 내보내기
export { motion }; 