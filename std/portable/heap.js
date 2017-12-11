var globalScope = typeof window !== "undefined" && window || typeof global !== "undefined" && global || self;

var HEAP = new Uint8Array(65536);
var HEAP_OFFSET = 0;

Object.defineProperties(globalScope["Heap"] = {
  allocate: function allocate(size) {
    if (!size) return 0;
    if (HEAP_OFFSET + size > HEAP.length) {
      var oldHeap = HEAP;
      HEAP = new Uint8Array(Math.max(HEAP.length + size, HEAP.length * 2));
      HEAP.set(oldHeap);
    }
    var ptr = HEAP_OFFSET;
    if ((HEAP_OFFSET += size) & 7)
      HEAP_OFFSET = (HEAP_OFFSET | 7) + 1;
    return ptr;
  },
  dispose: function dispose() { },
  copy: function copy(dest, src, n) {
    HEAP.set(HEAP.subarray(src, src + n), dest);
    return dest;
  }
}, {
  used: { get: function get_used() { return HEAP_OFFSET; } },
  free: { get: function get_free() { return HEAP.length - HEAP_OFFSET; } },
  size: { get: function get_size() { return HEAP.length; } }
});
globalScope["store"] = function store(ptr, val) {
  binaryen.HEAPU8[ptr] = val;
};
globalScope["load"] = function load(ptr) {
  return binaryen.HEAPU8[ptr];
};
