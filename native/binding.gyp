{
  "targets": [
    {
      "target_name": "display",
      "sources": ["addon.cc", "display.cpp"],
      "include_dirs": [
        "../node_modules/node-addon-api"
      ],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"]
    }
  ]
}
