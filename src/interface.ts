export interface InfoData {
    user?: UserData
    group?: GroupData
    user_list?: UserData[]
    service?: ServiceData[]
    connection?: ConnectionData[]
    info?: InfosData[]
    notice?: NoticeData[]
    ticket?: TicketData[]
}

export interface UserData {
    id: number
    group_id: number
    name: string
    name_en: string
    email: string
    status: number
    level: number
    mail_verify: boolean
}

export interface GroupData {
    id: number
    agree: boolean
    question: string
    org: string
    org_en: string
    postcode: string
    address: string
    address_en: string
    tel: string
    country: string
    contract: string
    student: boolean
    student_expired: string
    fee: number
    lock: boolean
    expired_status: number
    status: number
    pass: boolean
    add_allow: boolean
}

export interface ServiceData {
    id: number
    service_id: string
    service_type: string
    need_route: boolean
    add_allow: boolean
    pass: boolean
}

export interface ConnectionData {
    id: number
    open: boolean
}

export interface NoticeData {
    start_time: string
    end_time: string
    everyone: boolean
    fault: boolean
    important: boolean
    info: boolean
    title: string
    data: string
}

export interface TicketData {
    id: number
    created_at: string
    group_id: number
    user_id: number
    title: string
    chat?: ChatData[]
    solved: boolean
    admin: boolean
}

export interface ChatData {
    created_at: string
    ticket_id: number
    user_id: number
    user_name: string
    admin: boolean
    data: string
}

export interface InfosData {
    service_id: number
    service: string
    assign: boolean
    asn: number
    v4?: string[]
    v6?: string[]
    noc: string
    noc_ip: string
    term_ip: string
    link_v4_our: string
    link_v4_your: string
    link_v6_our: string
    link_v6_your: string
    fee: string
    org: string
    org_en: string
    postcode: string
    address: string
    address_en: string
    jpnic_admin?: JPNICData
    jpnic_tech?: JPNICData[]
    avg_downstream: number
    avg_upstream: number
    max_downstream: number
    max_upstream: number
    max_bandwidth_as: number
    bgp_route_v4: string
    bgp_route_v6: string
}

export interface JPNICData {
    ID: number
    address: string
    address_en: string
    country: string
    dept: string
    dept_en: string
    fax: string
    jpnic_handle: string
    mail: string
    name: string
    name_en: string
    org: string
    org_en: string
    postcode: string
    tel: string
    lock: boolean
}

export interface BGPRouterDetailData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    address: string
    comment: string
    enable: boolean
    hostname: string
    noc: NocTemplateData
    noc_id: number
    tunnel_endpoint_router: null
}

export interface NocTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string
    bandwidth: string
    bgp_router?: BGPRouterDetailData
    comment: string
    enable: boolean
    location: string
}

export interface NTTTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string
    comment: string
    hidden: boolean
}

export interface IPTemplateData {
    name: any;
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    comment: string
    hide: boolean
    quantity: number
    subnet: string
    title: string
}

export interface TunnelEndPointRouterTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    capacity: number
    comment: string
    enable: boolean
    hostname: string
    noc_id: number
    tunnel_endpoint_router_ip: TunnelEndPointRouterIPTemplateData[]
}

export interface TunnelEndPointRouterIPTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    ip: string
    enable: boolean
    tunnel_endpoint_router: TunnelEndPointRouterTemplateData
}

export interface ConnectionTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string
    type: string
    comment: string
    need_comment: boolean
    need_cross_connect: boolean
    need_internet: boolean
    l2: boolean
    l3: boolean
}

export interface ServiceTemplateData {
    ID: number
    name: string
    comment: string
    hidden: boolean
    type: string
    need_comment: boolean
    need_global_as: boolean
    need_jpnic: boolean
    need_route: boolean
}

export interface IPRouteData {
    ID: number
    CreatedAt: string
    UpdatedAt: string
    name: string
}

export interface TemplateData {
    services?: ServiceTemplateData[]
    connections?: ConnectionTemplateData[]
    ipv4?: IPTemplateData[]
    ipv6?: IPTemplateData[]
    nocs?: NocTemplateData[]
    ntts?: NTTTemplateData[]
    tunnel_endpoint_router?: TunnelEndPointRouterTemplateData[]
    tunnel_endpoint_router_ip?: TunnelEndPointRouterIPTemplateData[]
    ipv4_route?: IPRouteData[]
    ipv6_route?: IPRouteData[]
}

export interface GroupAddData {
    agree: boolean
    question: string
    org: string
    org_en: string
    postcode: string
    address: string
    address_en: string
    tel: string
    country: string
    contract: string
    student: boolean
    student_expired: string
}

export interface ServiceAddData {
    jpnic_admin?: ServiceAddJPNICData
    jpnic_tech?: ServiceAddJPNICData[]
    service_template_id: number
    service_comment: string
    org?: string
    org_en?: string
    postcode?: string
    address?: string
    address_en?: string
    route_v4?: string
    route_v6?: string
    avg_upstream: number
    max_upstream: number
    avg_downstream: number
    max_downstream: number
    max_bandwidth_as?: string
    asn?: number
    ip?: ServiceAddIPData[]
    start_date: string
    end_date?: string
}

export interface ServiceAddJPNICData {
    org: string
    org_en: string
    mail: string
    postcode: string
    address: string
    address_en: string
    name: string
    name_en: string
    dept_en: string
    dept: string
    country: string
    tel: string
    fax: string
}

export interface ServiceAddIPData {
    version: number
    ip: string
    plan?: ServiceAddIPv4PlanData[]
    name: string
    start_date: string
    end_date?: string
}

export interface ServiceAddIPv4PlanData {
    name: string
    after: number
    half_year: number
    one_year: number
}

export interface ConnectionAddData {
    address: string
    connection_template_id: number
    connection_comment: string
    ipv4_route_template_id?: number
    ipv6_route_template_id?: number
    ntt_template_id: number
    noc_id: number
    term_ip: string
    monitor: boolean
}

export interface SupportAddData {
    is_group: boolean
    title: string
    data: string
}

export interface UserAddData {
    name: string
    name_en: string
    email: string
    pass: string
    level: number
}

export const DefaultTemplateData: TemplateData = {
    services: undefined,
    ipv4: undefined,
    ipv6: undefined,
    nocs: undefined,
    ntts: undefined,
    tunnel_endpoint_router: undefined,
    tunnel_endpoint_router_ip: undefined,
}

export const DefaultGroupAddData: GroupAddData = {
    agree: false,
    question: "",
    org: "",
    org_en: "",
    postcode: "",
    address: "",
    address_en: "",
    tel: "",
    country: "",
    contract: "E-Mail",
    student: false,
    student_expired: "",
}

export const DefaultServiceAddData: ServiceAddData = {
    jpnic_admin: undefined,
    jpnic_tech: undefined,
    service_template_id: 0,
    service_comment: "",
    org: undefined,
    org_en: undefined,
    postcode: undefined,
    address: undefined,
    address_en: undefined,
    route_v4: undefined,
    route_v6: undefined,
    avg_upstream: 10,
    max_upstream: 100,
    avg_downstream: 10,
    max_downstream: 100,
    max_bandwidth_as: undefined,
    asn: undefined,
    ip: undefined,
    start_date: "",
    end_date: undefined
}

export const DefaultServiceAddJPNICData: ServiceAddJPNICData = {
    org: "",
    org_en: "",
    mail: "",
    postcode: "",
    address: "",
    address_en: "",
    name: "",
    name_en: "",
    dept_en: "",
    dept: "",
    country: "",
    tel: "",
    fax: "",
}

export const DefaultServiceAddIPv4PlanData: ServiceAddIPv4PlanData = {
    name: "",
    after: 0,
    half_year: 0,
    one_year: 0,
}

export const DefaultConnectionAddData: ConnectionAddData = {
    address: "",
    connection_template_id: 0,
    connection_comment: "",
    ntt_template_id: 0,
    noc_id: 0,
    term_ip: "",
    monitor: false
}

export const DefaultAddIP: ServiceAddIPData = {
    version: 0,
    ip: "",
    plan: undefined,
    name: "",
    start_date: "",
    end_date: undefined
}

export const DefaultSupportAddData: SupportAddData = {
    is_group: true,
    title: "",
    data: ""
}

export const DefaultUserAddData: UserAddData = {
    name: "",
    name_en: "",
    email: "",
    pass: "",
    level: 2
}