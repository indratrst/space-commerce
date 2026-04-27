export async function getProvinces() {
  const res = await fetch(`/api/wilayah?path=provinces.json`);
  return res.json();
}

export async function getRegencies(provinceCode: string) {
  const res = await fetch(`/api/wilayah?path=regencies/${provinceCode}.json`);
  return res.json();
}

export async function getDistricts(regencyCode: string) {
  const res = await fetch(`/api/wilayah?path=districts/${regencyCode}.json`);
  return res.json();
}
