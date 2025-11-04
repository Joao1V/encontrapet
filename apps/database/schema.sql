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
