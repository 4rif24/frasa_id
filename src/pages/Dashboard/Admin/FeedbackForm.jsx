import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import SectionTitle from '../../../components/SectioniTitle';
// import SectionTitle from '../../../components/SectioniTitle';

const FeedbackForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    feedback: '',
    rating: 5
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosSecure.post(`/classes/${id}/feedback`, formData);

      if (response.data.success) {
        Swal.fire('Berhasil!', 'Feedback berhasil dikirim', 'success');
        navigate('/dashboard/manage-classes');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire('Error', 'Gagal mengirim feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <SectionTitle
        heading="Beri Feedback Kelas"
        subHeading="Berikan masukan untuk pengembangan kelas"
      />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5)
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
              required
            >
              <option value={5}>5 ⭐ (Sangat Baik)</option>
              <option value={4}>4 ⭐ (Baik)</option>
              <option value={3}>3 ⭐ (Cukup)</option>
              <option value={2}>2 ⭐ (Kurang)</option>
              <option value={1}>1 ⭐ (Sangat Kurang)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows={6}
              placeholder="Masukkan feedback konstruktif untuk kelas ini..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-primary disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Feedback'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard/manage-classes')}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;