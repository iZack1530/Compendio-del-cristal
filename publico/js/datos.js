export const JUEGOS = [
  { id: 1, nombre: 'Final Fantasy', corto: 'I', color: '#3498DB' },
  { id: 2, nombre: 'Final Fantasy II', corto: 'II', color: '#E74C3C' },
  { id: 3, nombre: 'Final Fantasy III', corto: 'III', color: '#F1C40F' },
  { id: 4, nombre: 'Final Fantasy IV', corto: 'IV', color: '#9B59B6' },
  { id: 5, nombre: 'Final Fantasy V', corto: 'V', color: '#2ECC71' },
  { id: 6, nombre: 'Final Fantasy VI', corto: 'VI', color: '#E67E22' },
  { id: 7, nombre: 'Final Fantasy VII', corto: 'VII', color: '#1ABC9C' },
  { id: 8, nombre: 'Final Fantasy VIII', corto: 'VIII', color: '#34495E' },
  { id: 9, nombre: 'Final Fantasy IX', corto: 'IX', color: '#D35400' },
  { id: 10, nombre: 'Final Fantasy X', corto: 'X', color: '#2980B9' },
  { id: 11, nombre: 'Final Fantasy XI', corto: 'XI', color: '#7F8C8D' },
  { id: 12, nombre: 'Final Fantasy XII', corto: 'XII', color: '#95A5A6' },
  { id: 13, nombre: 'Final Fantasy XIII', corto: 'XIII', color: '#F39C12' },
  { id: 14, nombre: 'Final Fantasy XIV', corto: 'XIV', color: '#130CB7' },
  { id: 15, nombre: 'Final Fantasy XV', corto: 'XV', color: '#111111' },
  { id: 16, nombre: 'Final Fantasy XVI', corto: 'XVI', color: '#78281F' },
];

// Personajes principales por juego; se buscan por coincidencia parcial del nombre.
export const DESTACADOS = {
  1: ['Warrior of Light', 'Garland', 'Princess Sarah', 'Matoya'],
  2: ['Firion', 'Maria', 'Guy', 'Leon', 'Mateus'],
  3: ['Luneth', 'Arc', 'Refia', 'Ingus', 'Xande'],
  4: ['Cecil', 'Kain', 'Rosa', 'Rydia', 'Golbez', 'Edge'],
  5: ['Bartz', 'Lenna', 'Galuf', 'Faris', 'Krile', 'Exdeath'],
  6: ['Terra', 'Locke', 'Celes', 'Edgar', 'Sabin', 'Kefka'],
  7: ['Cloud', 'Aerith', 'Tifa', 'Barret', 'Sephiroth', 'Red XIII', 'Zack Fair', 'Vincent Valentine', 'Cid Highwind', 'Yuffie', 'Cait Sith'],
  8: ['Squall', 'Rinoa', 'Quistis', 'Zell', 'Seifer', 'Irvine', 'Edea'],
  9: ['Zidane', 'Garnet', 'Vivi', 'Steiner', 'Freya', 'Kuja'],
  10: ['Tidus', 'Yuna', 'Auron', 'Wakka', 'Lulu', 'Rikku', 'Seymour'],
  11: ['Shantotto', 'Prishe', 'Zeid', 'Cid'],
  12: ['Vaan', 'Ashe', 'Balthier', 'Fran', 'Basch', 'Penelo'],
  13: ['Lightning', 'Snow', 'Hope', 'Vanille', 'Sazh', 'Fang'],
  14: ['Alphinaud', 'Alisaie', "Y'shtola", 'Thancred', 'Estinien', 'Emet-Selch'],
  15: ['Noctis', 'Prompto', 'Gladiolus', 'Ignis', 'Lunafreya', 'Ardyn', 'Aranea'],
  16: ['Clive', 'Jill', 'Joshua', 'Cidolfus', 'Dion'],
};

// Nombres que coinciden parcialmente con un principal pero no deben mostrarse en esa pestaña.
export const EXCLUIDOS = {
  7: ['Sephiroth-Clone'],
};

// Logos con texto oscuro: llevan un halo claro para leerse sobre el fondo oscuro.
export const LOGOS_DE_TEXTO_OSCURO = new Set([4, 5, 6, 7, 8]);

// Logos altos y estrechos: se amplía su caja para que pesen visualmente igual que los anchos.
export const ESCALA_LOGO = { 8: 1.35, 12: 1.7 };
