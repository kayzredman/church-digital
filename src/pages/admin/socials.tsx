import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/components';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { api } from '@/lib/api';

const PLATFORMS = [
	{
		key: 'facebook',
		name: 'Facebook',
		icon: <Facebook className="w-6 h-6" color="#1877F3" />,
		color: 'text-[#1877F3]'
	},
	{
		key: 'instagram',
		name: 'Instagram',
		icon: <Instagram className="w-6 h-6" color="#E4405F" />,
		color: 'text-[#E4405F]'
	},
	{
		key: 'twitter',
		name: 'X (Twitter)',
		icon: <Twitter className="w-6 h-6" color="#000000" />,
		color: 'text-black'
	},
	{
		key: 'youtube',
		name: 'YouTube',
		icon: <Youtube className="w-6 h-6" color="#FF0000" />,
		color: 'text-[#FF0000]'
	},
];

export default function AdminSocials() {
	const [links, setLinks] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		async function fetchLinks() {
			setLoading(true);
			try {
				const res = await api.getSettings();
				setLinks(res.data.socialMedia || {});
			} catch {
				setLinks({});
			}
			setLoading(false);
		}
		fetchLinks();
	}, []);

	const handleChange = (key: string, value: string) => {
		setLinks((prev: any) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setSuccess(false);
		try {
			await api.updateSettings({ socialMedia: links });
			setSuccess(true);
		} catch {
			setSuccess(false);
		}
		setSaving(false);
	};

	return (
		<div className="max-w-2xl mx-auto py-8 px-4">
			<h1 className="text-2xl font-bold mb-8 text-center">Manage Social Links</h1>
			<Card className="p-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{PLATFORMS.map(platform => (
						<div key={platform.key} className="flex items-center gap-4">
							<span className={`rounded-full p-2 bg-gray-100 ${platform.color}`}>{platform.icon}</span>
							<label className="w-32 font-semibold">{platform.name}</label>
							<input
								type="url"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
								placeholder={`Enter ${platform.name} link`}
								value={links[platform.key] || ''}
								onChange={e => handleChange(platform.key, e.target.value)}
								autoComplete="off"
							/>
						</div>
					))}
					<div className="flex justify-end gap-4 pt-4">
						{success && <span className="text-green-600 font-medium">Saved!</span>}
						<Button type="submit" className="px-6 py-2" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
