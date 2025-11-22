export const WARDROBE = [
  // -------------------
  // Existing items
  // -------------------
  { id: "t1", cat: "top", name: "White Tee", color: "white", style: ["casual","street"], warmth: "light", formality: 0, img: "https://radstore.pk/cdn/shop/products/IMG_7140.jpg?v=1615635329" },
  { id: "t2", cat: "top", name: "Formal Shirt", color: "white", style: ["smart","classic"], warmth: "medium", formality: 2, img: "https://zellbury.com/cdn/shop/files/formal-shirts-e003-1_91258410-345a-4700-bdfb-b019a4ef4be4.jpg?v=1756281924&width=1946" },
  { id: "t3", cat: "top", name: "Winter Sweater", color: "navy", style: ["casual","smart"], warmth: "warm", formality: 1, img: "https://charcoal.com.pk/cdn/shop/products/HIGH-NECK-SWEATER-NAVY-at-Charcoal-Clothing-437.jpg?v=1680070325&width=2400" },

  { id: "b1", cat: "bottom", name: "Blue Jeans", color: "blue", style: ["casual","street"], warmth: "medium", formality: 0, img: "https://zellbury.com/cdn/shop/files/MD221054-DARKBLUE-1.jpg?v=1711706452" },
  { id: "b2", cat: "bottom", name: "Chinos", color: "beige", style: ["smart","casual"], warmth: "light", formality: 1, img: "https://desiminimals.com/cdn/shop/files/DSC_3892_8ae8b87a-7b14-409f-b3a6-4e1fc4514346.jpg?v=1753427580&width=1080" },
  { id: "b3", cat: "bottom", name: "Dark Trousers", color: "black", style: ["smart","classic"], warmth: "medium", formality: 2, img: "https://thehawk.pk/cdn/shop/products/IMG_20230331_153353.jpg?v=1680260929" },

  { id: "s1", cat: "shoes", name: "White Sneakers", color: "white", style: ["casual","sport"], warmth: "light", formality: 0, img: "https://www.calza.com.pk/cdn/shop/files/1_bea97659-2ce7-4e28-b23b-6b88e0d066be.jpg?v=1756726239" },
  { id: "s2", cat: "shoes", name: "Brown Oxfords", color: "brown", style: ["smart","classic"], warmth: "medium", formality: 2, img: "https://cdnimg.brunomarc.com/brunomarcs/image/article/20220818_79/PRINCE-16-post-mens-oxfords-with-suits-dfs2.jpg" },
  { id: "s3", cat: "shoes", name: "Boots", color: "brown", style: ["casual","outdoor"], warmth: "warm", formality: 1, img: "https://cdn-images.farfetch-contents.com/26/73/42/75/26734275_56399561_600.jpg" },

  { id: "o1", cat: "outer", name: "Light Jacket", color: "olive", style: ["casual","smart"], warmth: "medium", formality: 1, img: "https://cdn.muftijeans.in/media/catalog/product/s/s/ss-24_4000x5000-04-10-24_93_style_mfj-1162-s-141-light-olive_1_mfj-1162-s-141-light-olive.jpg" },
  { id: "o2", cat: "outer", name: "Overcoat", color: "black", style: ["smart","classic"], warmth: "warm", formality: 2, img: "https://i.pinimg.com/originals/cb/d0/ee/cbd0eee257629c29f9802e25dfe06e86.jpg" },

  // -------------------
  // New Modern / Esthetic Tops
  // -------------------
  { id: "t4", cat: "top", name: "Minimalist Hoodie", color: "grey", style: ["casual","street"], warmth: "medium", formality: 0, img: "" },
  { id: "t5", cat: "top", name: "Crop Tee", color: "white", style: ["casual","esthetic"], warmth: "light", formality: 0, img: "" },
  { id: "t6", cat: "top", name: "Sports Jersey", color: "red", style: ["sport","casual"], warmth: "light", formality: 0, img: "" },

  // -------------------
  // New Modern / Esthetic Bottoms
  // -------------------
  { id: "b4", cat: "bottom", name: "Ripped Jeans", color: "blue", style: ["casual","street"], warmth: "medium", formality: 0, img: "" },
  { id: "b5", cat: "bottom", name: "Cargo Pants", color: "olive", style: ["casual","street","esthetic"], warmth: "medium", formality: 0, img: "" },
  { id: "b6", cat: "bottom", name: "Track Pants", color: "black", style: ["sport","casual"], warmth: "light", formality: 0, img: "" },

  // -------------------
  // New Sports Shoes / Modern Shoes
  // -------------------
  { id: "s4", cat: "shoes", name: "Running Sneakers", color: "white", style: ["sport","casual"], warmth: "light", formality: 0, img: "" },
  { id: "s5", cat: "shoes", name: "High-top Sneakers", color: "black", style: ["casual","street","esthetic"], warmth: "light", formality: 0, img: "" },
  { id: "s6", cat: "shoes", name: "Football Cleats", color: "black", style: ["sport"], warmth: "light", formality: 0, img: "" },

  // -------------------
  // Optional Outer / Modern
  // -------------------
  { id: "o3", cat: "outer", name: "Bomber Jacket", color: "black", style: ["casual","street","esthetic"], warmth: "medium", formality: 0, img: "" },
  { id: "o4", cat: "outer", name: "Windbreaker", color: "blue", style: ["sport","casual"], warmth: "light", formality: 0, img: "" }
];

export const MANDATORY_CATS = ["top","bottom","shoes"];
export const OPTIONAL_CATS = ["outer"];
