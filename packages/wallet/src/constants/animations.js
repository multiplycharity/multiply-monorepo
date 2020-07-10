const animations = {
  fadeInDown: {
    from: {
      opacity: 0.9,
      translateY: -50,
      translateX: -10,
      scale: 0.6
    },
    to: {
      opacity: 1,
      translateY: 0,
      translateX: 0,
      scale: 1
    }
  },
  moveLeft: {
    from: { translateX: 10 },
    to: { translateX: 0 }
  },
  fadeInAndScale: {
    0: { opacity: 0.6, scale: 0.4 },
    1: { opacity: 1, scale: 1 }
  },

  fadeInAndOut: {
    0: {
      opacity: 0
    },
    0.5: { opacity: 1 },
    1: { opacity: 0 }
  },
  shake: {
    0: {
      translateX: 0
    },
    0.2: {
      translateX: -7.5
    },
    0.4: {
      translateX: 7.5
    },
    0.6: {
      translateX: -7.5
    },
    0.8: {
      translateX: 7.5
    },
    1: {
      translateX: 0
    }
  }
}

export default animations
