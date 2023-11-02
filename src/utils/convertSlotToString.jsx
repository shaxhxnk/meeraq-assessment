import moment from "moment";

export const convertSlotToString = (slot) => {
  return moment(new Date(+slot?.start_time)).format("DD-MM-YYYY hh:mm A");
};

export const getDateAndTimeFromSlot = (slot) => {
  return (
    <div className="flex flex-col">
      <p className="whitespace-nowrap">
        {moment(new Date(+slot?.start_time)).format("DD MMMM YYYY")}
      </p>
      <p className="whitespace-nowrap">
        {moment(new Date(+slot?.start_time)).format("hh:mm A")}
      </p>
    </div>
  );
};

export const getDate = (slot) => moment(new Date(+slot?.start_time)).format("DD MMMM YYYY")
export const getTime = (slot) => moment(new Date(+slot?.start_time)).format("hh:mm A")

export function formatDate(dateString) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(dateString);

  const day = date.toLocaleDateString(undefined, { day: "numeric" });
  const month = date.toLocaleDateString(undefined, { month: "long" });
  const year = date.toLocaleDateString(undefined, { year: "numeric" });

  return `${day} ${month} ${year}`;
}

export const disabledDate = (current) => {
  // Disable dates today and before today's date
  return current && current < moment().endOf("day");
};


export function formateDate(inputDate) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  const formattedDateandTime = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;

  return formattedDateandTime;
};

export function formateTime(inputDate) {
  const date = new Date(inputDate);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return formattedTime;
};

export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}