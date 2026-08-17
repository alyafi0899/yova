import React, { useState } from 'react'
import type { TemplateElement } from '../../../lib/invitation/types'

interface DraggableElementProps {
  element: TemplateElement
  mode: 'edit' | 'preview' | 'public'
  isActive: boolean
  onClick: () => void
  onUpdate: (updates: Partial<TemplateElement>) => void
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  mode,
  isActive,
  onClick,
  onUpdate
}) => {
  const [isTransforming, setIsTransforming] = useState(false)
  const { style } = element

  const handleDrag = (e: React.MouseEvent) => {
    if (mode !== 'edit' || element.locked) return
    e.stopPropagation()
    setIsTransforming(true)
    onClick()

    const startX = e.clientX
    const startY = e.clientY
    const startPosX = style.position.x
    const startPosY = style.position.y

    const onMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / window.innerWidth) * 100
      const deltaY = ((moveEvent.clientY - startY) / window.innerHeight) * 100

      onUpdate({
        style: {
          ...style,
          position: {
            x: startPosX + deltaX,
            y: startPosY + deltaY
          }
        }
      })
    }

    const onEnd = () => {
      setIsTransforming(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onEnd)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onEnd)
  }

  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTransforming(true)

    const startX = e.clientX
    const startWidth = typeof style.size.width === 'number' ? style.size.width : 100

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const newSize = Math.max(20, startWidth + delta)
      onUpdate({
        style: {
          ...style,
          size: { width: newSize, height: newSize } // maintain aspect ratio for now
        }
      })
    }

    const onEnd = () => {
      setIsTransforming(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onEnd)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onEnd)
  }

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTransforming(true)

    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const onMove = (moveEvent: MouseEvent) => {
      const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX)
      const degrees = (angle * 180) / Math.PI + 90
      onUpdate({
        style: {
          ...style,
          rotation: degrees
        }
      })
    }

    const onEnd = () => {
      setIsTransforming(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onEnd)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onEnd)
  }

  return (
    <div
      className={`absolute transition-shadow ${
        mode === 'edit' ? 'cursor-move hover:ring-1 hover:ring-mocha/50' : ''
      } ${isActive ? 'ring-2 ring-mocha shadow-2xl z-50' : ''}`}
      style={{
        left: `${style.position.x}%`,
        top: `${style.position.y}%`,
        transform: `translate(-50%, -50%) rotate(${style.rotation}deg)`,
        width: style.size.width,
        height: style.size.height,
        opacity: style.opacity,
        zIndex: style.zIndex
      }}
      onMouseDown={handleDrag}
    >
       <div className="w-full h-full pointer-events-none">
          {element.assetUrl ? (
             <img src={element.assetUrl} className="w-full h-full object-contain" alt="" />
          ) : (
             <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: element.content || '' }} />
          )}
       </div>

       {mode === 'edit' && isActive && !element.locked && (
         <>
            {/* Resize handle */}
            <div
              className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border-2 border-mocha rounded-full cursor-nwse-resize shadow-md"
              onMouseDown={handleResize}
            />
            {/* Rotate handle */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-mocha rounded-full cursor-alias flex items-center justify-center shadow-md"
              onMouseDown={handleRotate}
            >
               <span className="text-[10px] leading-none">⟳</span>
            </div>
            {/* Label */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-mocha text-white text-[7px] font-bold uppercase px-2 py-0.5 whitespace-nowrap shadow-md">
               {element.id}
            </div>
         </>
       )}
    </div>
  )
}

export default DraggableElement
