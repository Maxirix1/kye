import React from 'react';
import '../style/DestinationFormSection.css';

function DestinationFormSection({ title, color }) {
  return (
    <div className={`form-section ${color}`}>
      <h3>{title}</h3>
      <div className="input-group">
        <label>สาขา:</label>
        <select>
          <option>{'สาขาที่ประจำอยู่'}</option>
        </select>
      </div>
      <div className="input-group">
        <label>เบอร์ผู้สั่ง:</label>
        <input type="text" placeholder="+66" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />
      </div>
      <div className="input-group">
        <label>ชื่อผู้สั่ง:</label>
        <input type="text" placeholder="Name Lastname" />
      </div>
    <div>
      <input type='checkbox' className='flex'/>
      <p className='text-md'>รับที่สาขา</p>
    </div>
      <div className="input-group">
        <label>หมายเหตุ:</label>
        <textarea placeholder="เพิ่มหมายเหตุ"></textarea>
      </div>
    </div>
  );
}

export default DestinationFormSection;
