import React from 'react';
import './ContentEditor.css';

const ContentEditor = ({ content = [], onChange }) => {

  const handleRemoveContent = (index) => {
    const newContent = content.filter((_, i) => i !== index);
    onChange(newContent);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newContent = [...content];
    [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
    onChange(newContent);
  };

  const handleMoveDown = (index) => {
    if (index === content.length - 1) return;
    const newContent = [...content];
    [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
    onChange(newContent);
  };

  const renderContentPreview = (item, index) => {
    switch (item.type) {
      case 'text':
        return (
          <div className="content-editor-preview-text">
            <span className="content-editor-preview-label">Text:</span>
            <span className="content-editor-preview-value">
              {item.value.length > 100 ? `${item.value.substring(0, 100)}...` : item.value}
            </span>
          </div>
        );

      case 'image':
        return (
          <div className="content-editor-preview-image">
            <span className="content-editor-preview-label">Image:</span>
            {item.preview ? (
              <img src={item.preview} alt="Preview" className="content-editor-image-thumbnail" />
            ) : (
              <span className="content-editor-preview-value">{item.file?.name || 'Image file'}</span>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="content-editor-preview-code">
            <span className="content-editor-preview-label">Code ({item.language}):</span>
            <span className="content-editor-preview-value">
              {item.title || 'Code Snippet'} - {item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value}
            </span>
          </div>
        );

      case 'link':
        return (
          <div className="content-editor-preview-link">
            <span className="content-editor-preview-label">Link:</span>
            <span className="content-editor-preview-value">
              {item.placeholder} → {item.value}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="content-editor">
      <div className="content-editor-list">
        {content.map((item, index) => (
          <div key={index} className="content-editor-item">
            <div className="content-editor-item-header">
              <span className="content-editor-item-number">{index + 1}</span>
              <span className="content-editor-item-type">{item.type.toUpperCase()}</span>
            </div>
            <div className="content-editor-item-body">
              {renderContentPreview(item, index)}
            </div>
            <div className="content-editor-item-actions">
              <button
                type="button"
                className="content-editor-action-button"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                title="Move up"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="content-editor-action-button"
                onClick={() => handleMoveDown(index)}
                disabled={index === content.length - 1}
                title="Move down"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="content-editor-action-button content-editor-remove-button"
                onClick={() => handleRemoveContent(index)}
                title="Remove"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentEditor;

