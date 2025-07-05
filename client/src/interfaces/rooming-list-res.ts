export interface RoomingList {
    check_out_date: string | number | Date;
    check_in_date: string | number | Date;
    rooming_list_id: number;
    event_id:        number;
    hotel_id:        number;
    rfp_name:        string;
    cut_off_date:    Date;
    status:          string;
    agreement_type:  string;
}