#include <windows.h>
#include <iostream>

bool SetResolution(int width, int height, int freq) {
    DEVMODE devmode = {0};
    devmode.dmSize = sizeof(devmode);
    devmode.dmPelsWidth = width;
    devmode.dmPelsHeight = height;
    devmode.dmDisplayFrequency = freq;
    devmode.dmFields = DM_PELSWIDTH | DM_PELSHEIGHT | DM_DISPLAYFREQUENCY;

    LONG result = ChangeDisplaySettings(&devmode, CDS_UPDATEREGISTRY);

    return result == DISP_CHANGE_SUCCESSFUL;
}
