import React from 'react';
import { Edit3, Save } from 'lucide-react';

interface EditBtnProps {
  editMode: boolean;
  saving?: boolean;
  onEdit: () => void;
  onSave: () => void;
  labels: { edit: string; save: string };
}

const EditBtn: React.FC<EditBtnProps> = ({ editMode, saving = false, onEdit, onSave, labels }) => {
  return !editMode ? (
    <button
      onClick={onEdit}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      <Edit3 size={18} /> {labels.edit}
    </button>
  ) : (
    <button
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      <Save size={18} /> {saving ? 'Сохраняем...' : labels.save}
    </button>
  );
};

export default EditBtn;
