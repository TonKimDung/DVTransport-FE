import {
useState,
} from "react";

import {
Send,
} from "lucide-react";

import {
recruitmentService,
} from "../../services/recruitmentService";

import type {
RecruitmentCampaign,
JobApplicationRequest,
} from "../../types/recruitment";

interface Props {
campaign: RecruitmentCampaign;
}

function FormLabel({
children,
}: {
children: React.ReactNode;
}) {
return ( <label className="block text-sm font-semibold text-slate-700 mb-2">
{children} </label>
);
}

export default function JobApplicationForm({
campaign,
}: Props) {
const [loading, setLoading] =
useState(false);

const [form, setForm] =
useState<JobApplicationRequest>({
campaignId: campaign.id,
fullName: "",
phone: "",
email: "",
address: "",
experienceYears: 0,
licenseNumber: "",
licenseExpiry: "",
licenseClass: "",
licenseImage: "",
licenseIssueDate: "",
});

const handleChange = (
e: React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement |
HTMLSelectElement
>
) => {
setForm({
...form,
[e.target.name]:
e.target.value,
});
};

const handleSubmit =
async (
e: React.FormEvent
) => {
e.preventDefault();
  try {
    setLoading(true);

    await recruitmentService.createApplication(
      {
        ...form,
        campaignId:
          campaign.id,
      }
    );

    alert(
      "Ứng tuyển thành công!"
    );

    setForm({
      campaignId:
        campaign.id,
      fullName: "",
      phone: "",
      email: "",
      address: "",
      experienceYears: 0,
      licenseNumber: "",
      licenseExpiry: "",
      licenseClass: "",
      licenseImage: "",
      licenseIssueDate: "",
    });
  } catch (error) {
    console.error(error);

    alert(
      "Không thể gửi hồ sơ."
    );
  } finally {
    setLoading(false);
  }
};


return (
<form
onSubmit={
handleSubmit
}
className="
bg-white
border
border-slate-200
rounded-[32px]
p-8
space-y-5
shadow-sm
"
> <div> <h3 className="text-2xl font-bold text-slate-900">
Ứng tuyển vị trí </h3>

    <p className="text-slate-500 mt-1">
      {campaign.title}
    </p>
  </div>

  <div>
    <FormLabel>
      Họ và tên *
    </FormLabel>

    <input
      required
      name="fullName"
      value={
        form.fullName
      }
      onChange={
        handleChange
      }
      placeholder="Nguyễn Văn A"
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    />
  </div>

  <div>
    <FormLabel>
      Số điện thoại *
    </FormLabel>

    <input
      required
      name="phone"
      value={
        form.phone
      }
      onChange={
        handleChange
      }
      placeholder="0901234567"
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    />
  </div>

  <div>
    <FormLabel>
      Email *
    </FormLabel>

    <input
      required
      type="email"
      name="email"
      value={
        form.email
      }
      onChange={
        handleChange
      }
      placeholder="example@gmail.com"
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    />
  </div>

  <div>
    <FormLabel>
      Địa chỉ hiện tại *
    </FormLabel>

    <textarea
      required
      rows={3}
      name="address"
      value={
        form.address
      }
      onChange={
        handleChange
      }
      placeholder="Thủ Đức, TP.HCM"
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    />
  </div>

  <div>
    <FormLabel>
      Số năm kinh nghiệm *
    </FormLabel>

    <input
      required
      min="0"
      type="number"
      name="experienceYears"
      value={
        form.experienceYears
      }
      onChange={
        handleChange
      }
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    />
  </div>

  <div>
    <FormLabel>
      Số GPLX *
    </FormLabel>

    <input
      required
      name="licenseNumber"
      value={
        form.licenseNumber
      }
      onChange={
        handleChange
      }
      placeholder="790xxxxxxxx"
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    />
  </div>

  <div>
    <FormLabel>
      Hạng GPLX *
    </FormLabel>

    <select
      required
      name="licenseClass"
      value={
        form.licenseClass
      }
      onChange={
        handleChange
      }
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    >
      <option value="">
        Chọn hạng bằng lái
      </option>

      <option value="B1">
        B1
      </option>

      <option value="B2">
        B2
      </option>

      <option value="C">
        C
      </option>

      <option value="D">
        D
      </option>

      <option value="E">
        E
      </option>

      <option value="FC">
        FC
      </option>
    </select>
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <FormLabel>
        Ngày cấp GPLX *
      </FormLabel>

      <input
        required
        type="date"
        name="licenseIssueDate"
        value={
          form.licenseIssueDate
        }
        onChange={
          handleChange
        }
        className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
      />
    </div>

    <div>
      <FormLabel>
        Ngày hết hạn GPLX *
      </FormLabel>

      <input
        required
        type="date"
        name="licenseExpiry"
        value={
          form.licenseExpiry
        }
        onChange={
          handleChange
        }
        className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
      />
    </div>
  </div>

  <div>
    <FormLabel>
      Link ảnh GPLX *
    </FormLabel>

    <input
      required
      name="licenseImage"
      value={
        form.licenseImage
      }
      onChange={
        handleChange
      }
      placeholder="https://..."
      className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-300"
    />

    <p className="text-xs text-slate-500 mt-2">
      Dán URL ảnh giấy phép lái xe.
    </p>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="
      w-full
      bg-orange-500
      hover:bg-orange-600
      disabled:bg-slate-400
      text-white
      py-4
      rounded-xl
      font-semibold
      flex
      justify-center
      items-center
      gap-2
      transition
    "
  >
    <Send size={18} />

    {loading
      ? "Đang gửi hồ sơ..."
      : "Gửi hồ sơ ứng tuyển"}
  </button>
</form>


);
}
