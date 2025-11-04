create type enum_animals_size as enum ('small', 'medium', 'large');

alter type enum_animals_size owner to postgres;

create type enum_animals_gender as enum ('male', 'female', 'unknown');

alter type enum_animals_gender owner to postgres;

create type enum_publications_type as enum ('lost', 'found', 'adoption');

alter type enum_publications_type owner to postgres;

create type enum_publications_status as enum ('open', 'closed', 'resolved');

alter type enum_publications_status owner to postgres;

create type enum_users_role as enum ('admin', 'user');

alter type enum_users_role owner to postgres;

create type enum_animals_species as enum ('dog', 'cat');

alter type enum_animals_species owner to postgres;

create table users
(
    id                        serial
        primary key,
    updated_at                timestamp(3) with time zone default now() not null,
    created_at                timestamp(3) with time zone default now() not null,
    email                     varchar                                   not null,
    reset_password_token      varchar,
    reset_password_expiration timestamp(3) with time zone,
    salt                      varchar,
    hash                      varchar,
    login_attempts            numeric                     default 0,
    lock_until                timestamp(3) with time zone,
    name                      varchar                                   not null,
    phone                     varchar,
    api_key                   varchar,
    api_key_index             varchar,
    role                      enum_users_role             default 'user'::enum_users_role,
    enable_a_p_i_key          boolean,
    birth_date                timestamp(3) with time zone
);

alter table users
    owner to postgres;


create table products
(
    id         serial
        primary key,
    name       varchar                                   not null,
    price      numeric                                   not null,
    updated_at timestamp(3) with time zone default now() not null,
    created_at timestamp(3) with time zone default now() not null
);

alter table products
    owner to postgres;


create table locations
(
    id          serial
        primary key,
    district    varchar,
    city        varchar                                   not null,
    state       varchar                                   not null,
    coordinates geometry(Point),
    updated_at  timestamp(3) with time zone default now() not null,
    created_at  timestamp(3) with time zone default now() not null,
    street      varchar                                   not null
);

alter table locations
    owner to postgres;

create table users_sessions
(
    _order     integer                     not null,
    _parent_id integer                     not null
        constraint users_sessions_parent_id_fk
            references users
            on delete cascade,
    id         varchar                     not null
        primary key,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone not null
);

alter table users_sessions
    owner to postgres;


create table animals
(
    id         serial
        primary key,
    name       varchar                                   not null,
    species    enum_animals_species                      not null,
    size       enum_animals_size,
    color      varchar,
    has_collar boolean                     default false,
    gender     enum_animals_gender,
    notes      varchar,
    updated_at timestamp(3) with time zone default now() not null,
    created_at timestamp(3) with time zone default now() not null,
    user_id    integer                                   not null
        constraint animals_user_id_users_id_fk
            references users
            on delete set null
);

alter table animals
    owner to postgres;

create table publications
(
    id                 serial
        primary key,
    title              varchar                                                              not null,
    description        varchar,
    type               enum_publications_type                                               not null,
    status             enum_publications_status    default 'open'::enum_publications_status not null,
    user_id            integer                                                              not null
        constraint publications_user_id_users_id_fk
            references users
            on delete set null,
    animal_id          integer
        constraint publications_animal_id_animals_id_fk
            references animals
            on delete set null,
    location_id        integer
        constraint publications_location_id_locations_id_fk
            references locations
            on delete set null,
    updated_at         timestamp(3) with time zone default now()                            not null,
    created_at         timestamp(3) with time zone default now()                            not null,
    disappearance_date timestamp(3) with time zone
);

alter table publications
    owner to postgres;

create table photos
(
    id              integer                     default nextval('media_id_seq'::regclass) not null
        constraint media_pkey
            primary key,
    updated_at      timestamp(3) with time zone default now()                             not null,
    created_at      timestamp(3) with time zone default now()                             not null,
    url             varchar,
    thumbnail_u_r_l varchar,
    filename        varchar,
    mime_type       varchar,
    filesize        numeric,
    width           numeric,
    height          numeric,
    focal_x         numeric,
    focal_y         numeric,
    publication_id  integer
        constraint photos_publication_id_publications_id_fk
            references publications
            on delete set null,
    animal_id       integer
        constraint photos_animal_id_animals_id_fk
            references animals
            on delete set null,
    prefix          varchar                     default 'teste/photos'::character varying
);

alter table photos
    owner to postgres;


create table feedback
(
    id             serial
        primary key,
    reunited       boolean                     default false,
    comment        varchar,
    publication_id integer                                   not null
        constraint feedback_publication_id_publications_id_fk
            references publications
            on delete set null,
    user_id        integer                                   not null
        constraint feedback_user_id_users_id_fk
            references users
            on delete set null,
    updated_at     timestamp(3) with time zone default now() not null,
    created_at     timestamp(3) with time zone default now() not null
);

alter table feedback
    owner to postgres;
