import * as FingerprintJS from '@fingerprintjs/fingerprintjs'
export const getFingerId = async() => {
    const fp = await FingerprintJS.load({ debug: true })
    const { visitorId } = await fp.get();
    return visitorId;
}