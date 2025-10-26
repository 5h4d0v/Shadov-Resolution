#include <napi.h>
#include "windows.h"

// deklaracja z display.cpp
bool SetResolution(int width, int height, int freq);

Napi::Value ChangeResWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 3) {
        Napi::TypeError::New(env, "Expected 3 arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int width = info[0].As<Napi::Number>().Int32Value();
    int height = info[1].As<Napi::Number>().Int32Value();
    int freq = info[2].As<Napi::Number>().Int32Value();

    bool success = SetResolution(width, height, freq);

    return Napi::Boolean::New(env, success);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("setResolution", Napi::Function::New(env, ChangeResWrapped));
    return exports;
}

NODE_API_MODULE(display, Init)
