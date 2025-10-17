import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

const ReCaptcha = forwardRef(({ siteKey, onChange, onExpired, theme = 'light' }, ref) => {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    reset: () => innerRef.current?.reset(),
    getValue: () => innerRef.current?.getValue()
  }), [])

  return (
    <ReCAPTCHA
      ref={innerRef}
      sitekey={siteKey}
      onChange={onChange}
      onExpired={onExpired}
      theme={theme}
    />
  )
})

export default ReCaptcha
