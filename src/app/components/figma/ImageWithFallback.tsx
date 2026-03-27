import React, { useMemo, useState } from 'react'

const DEFAULT_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIHJ4PSIzMiIgZmlsbD0iIzE1MTkyMCIvPjxwYXRoIGQ9Ik0xNTAgNDQwTDI1MCAzNDBMMzMwIDQyMEw0MTAgMzQwTDQ1MCAzODBWNDQwSDE1MFoiIGZpbGw9IiMyMTI2MzAiLz48Y2lyY2xlIGN4PSIzNjAiIGN5PSIyMjAiIHI9IjUyIiBmaWxsPSIjMkQzNDQwIi8+PHBhdGggZD0iTTE5MCA0MTBDMTkwIDM2NC43NzEgMjI2Ljc3MSAzMjggMjcyIDMyOEMzMTcuMjI5IDMyOCAzNTQgMzY0Ljc3MSAzNTQgNDEwVjQ0MEgxOTBWNDEwWiIgZmlsbD0iIzZDN0E4OSIvPjxwYXRoIGQ9Ik0xNzAgNDcwSDQzMFY0OTBIMTcwVjQ3MFoiIGZpbGw9IiNENkIzNkEiIGZpbGwtb3BhY2l0eT0iMC4zNSIvPjwvc3ZnPg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt = '', style, className, onError, loading, decoding, ...rest } = props
  const [didError, setDidError] = useState(false)

  const safeSrc = useMemo(() => {
    if (didError) return DEFAULT_IMG_SRC
    if (typeof src !== 'string') return DEFAULT_IMG_SRC
    const trimmed = src.trim()
    if (!trimmed) return DEFAULT_IMG_SRC
    return trimmed
  }, [didError, src])

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    if (!didError) setDidError(true)
    onError?.(event)
  }

  return React.createElement('img', {
    src: safeSrc,
    alt,
    className,
    style,
    loading: loading ?? 'lazy',
    decoding: decoding ?? 'async',
    ...rest,
    onError: handleError,
    'data-original-url': typeof src === 'string' ? src : undefined,
  })
}
