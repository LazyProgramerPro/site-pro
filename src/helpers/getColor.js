const getColor = (letter) => {
  const colors = {
    A: '#FF5733',
    B: '#33FF57',
    C: '#3357FF',
    D: '#FF33A1',
    E: '#FF8C33',
    F: '#33FFA1',
    G: '#A133FF',
    H: '#FF33D4',
    I: '#33D4FF',
    J: '#D4FF33',
    K: '#FF33A1',
    L: '#FF8C33',
    M: '#33FFA1',
    N: '#A133FF',
    O: '#FF33D4',
    P: '#33D4FF',
    Q: '#D4FF33',
    R: '#FF33A1',
    S: '#FF8C33',
    T: '#33FFA1',
    U: '#A133FF',
    V: '#FF33D4',
    W: '#33D4FF',
    X: '#D4FF33',
    Y: '#FF33A1',
    Z: '#FF8C33',
  };
  return colors[letter?.toUpperCase()] || '#000000'; // default color if letter not found
};

export default getColor;
