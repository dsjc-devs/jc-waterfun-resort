import React from 'react'
import { toast as baseToast } from 'react-toastify'
import CustomToast from '../components/CustomToast'

const defaultOpts = {
  icon: false,
  closeOnClick: false,
}

// Normalize input: string | { title?, message? }
const normalize = (input) => {
  if (React.isValidElement(input)) return { node: input }
  if (typeof input === 'string') return { title: undefined, message: input }
  if (typeof input === 'object' && input !== null) return input
  return { message: String(input) }
}

const render = (variant, input, opts = {}) => {
  const { node, title, message, actionLabel, onAction } = normalize(input)
  const content = node ?? (
    <CustomToast
      title={title}
      message={message}
      variant={variant}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  )

  return baseToast(content, { ...defaultOpts, ...opts })
}

const loading = (input, opts = {}) => {
  const { node, title, message } = normalize(input)
  const content = node ?? (
    <CustomToast title={title ?? 'Please wait'} message={message} variant="info" />
  )
  return baseToast.loading(content, { ...defaultOpts, ...opts })
}

const promise = (promiseFn, messages, opts = {}) => {
  const { pending, success, error } = messages
  return baseToast.promise(
    promiseFn,
    {
      pending: (
        <CustomToast
          title={pending?.title ?? 'Working on it…'}
          message={pending?.message ?? (typeof pending === 'string' ? pending : undefined)}
          variant="info"
        />
      ),
      success: (
        <CustomToast
          title={success?.title ?? 'Done'}
          message={success?.message ?? (typeof success === 'string' ? success : undefined)}
          variant="success"
        />
      ),
      error: (
        <CustomToast
          title={error?.title ?? 'Something went wrong'}
          message={error?.message ?? (typeof error === 'string' ? error : undefined)}
          variant="error"
        />
      )
    },
    { ...defaultOpts, ...opts }
  )
}

export const toast = {
  success: (input, opts) => render('success', input, opts),
  error: (input, opts) => render('error', input, opts),
  warning: (input, opts) => render('warning', input, opts),
  info: (input, opts) => render('info', input, opts),
  loading,
  promise,
  // passthrough utilities
  dismiss: baseToast.dismiss,
  isActive: baseToast.isActive,
  update: baseToast.update,
}

export default toast
