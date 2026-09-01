function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function tlv(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0')
  return `${id}${len}${value}`
}

export function generatePixPayload(
  key: string,
  merchantName: string,
  merchantCity: string,
  amount?: number
): string {
  const name = merchantName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .slice(0, 25)

  const city = merchantCity
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .slice(0, 15)

  const merchantInfo = tlv('00', 'br.gov.bcb.pix') + tlv('01', key)

  let payload = ''
  payload += tlv('00', '01')
  payload += tlv('01', '11')
  payload += tlv('26', merchantInfo)
  payload += tlv('52', '0000')
  payload += tlv('53', '986')
  payload += tlv('58', 'BR')
  payload += tlv('59', name)
  payload += tlv('60', city)
  if (amount !== undefined && amount > 0) {
    payload += tlv('54', amount.toFixed(2))
  }
  payload += '6304'

  const crc = crc16(payload)

  return payload + crc
}
