theme: {
  extend: {
    keyframes: {
      shake: {
        '10%, 90%': { transform: 'translateX(-3px)' },
        '20%, 80%': { transform: 'translateX(5px)' },
        '30%, 50%, 70%': { transform: 'translateX(-5px)' },
        '40%, 60%': { transform: 'translateX(5px)' },
      },
    },
    animation: {
      shake: 'shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97)',
    },
  },
},